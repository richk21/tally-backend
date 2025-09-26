import db from '../firebase/admin';
import { Request, Response } from 'express';
import { ISurvey } from '../interface/Survey';
import { insertIfNotExists } from '../utils/insertIfNotExists';
import { IRating } from '../interface/Rating';
import { IAmenity } from '../interface/Amenity';
import { getAgeGroup } from '../utils/getAgeGroup';

export const addSurvey = async (req: Request, res: Response) => {
  try {
    const { name, age, occupation, locality, ratings, amenities, comments } =
      req.body as ISurvey;

    const normalizedLocality = {
      state: locality.state.trim().toLowerCase(),
      city: locality.city.trim().toLowerCase(),
      area: locality.area.trim().toLowerCase(),
      pincode: locality.pincode || '',
    };

    await db.collection('surveys').add({
      name,
      age,
      occupation,
      locality: normalizedLocality,
      ratings,
      amenities,
      comments,
      createdAt: new Date(),
    });

    const localityId = `${locality.state}-${locality.city}-${locality.area}-${locality.pincode || ''}`;
    const localityDoc = await db.collection('localities').doc(localityId).get();
    if (!localityDoc.exists) {
      await db.collection('localities').doc(localityId).set(locality);
    }

    await Promise.all([
      insertIfNotExists('localities_states', normalizedLocality.state),
      insertIfNotExists('localities_cities', normalizedLocality.city),
      insertIfNotExists('localities_areas', normalizedLocality.area),
      insertIfNotExists('localities_pincodes', normalizedLocality.pincode),
    ]);

    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSurveyStatsByLocality = async (req: Request, res: Response) => {
  try {
    const { locality } = req.query;
    if (!locality) {
      return res
        .status(400)
        .json({ error: 'locality query parameter is required' });
    }
    const normalizedLoc = String(locality).toLowerCase();

    const surveysByState = await db
      .collection('surveys')
      .where('locality.state', '==', normalizedLoc)
      .get();
    const surveysByCity = await db
      .collection('surveys')
      .where('locality.city', '==', normalizedLoc)
      .get();
    const surveysByArea = await db
      .collection('surveys')
      .where('locality.area', '==', normalizedLoc)
      .get();
    const surveysByPincode = await db
      .collection('surveys')
      .where('locality.pincode', '==', normalizedLoc)
      .get();

    const allDocsMap = new Map<
      string,
      FirebaseFirestore.QueryDocumentSnapshot
    >();
    [surveysByState, surveysByCity, surveysByArea, surveysByPincode].forEach(
      (snapshot) => {
        snapshot.forEach((doc) => {
          if (!allDocsMap.has(doc.id)) {
            allDocsMap.set(doc.id, doc);
          }
        });
      }
    );

    if (allDocsMap.size === 0) {
      return res.json({ success: true, stats: null });
    }

    let ratingsSum: IRating = {
      cleanliness: 0,
      waterQuality: 0,
      airQuality: 0,
      noiseLevel: 0,
      roadQuality: 0,
      affordability: 0,
      safety: 0,
      internetQuality: 0,
    };
    let ratingsCount = 0;

    let amenitiesSum: IAmenity = {
      hospital: 0,
      groceryStore: 0,
      vegetableVendor: 0,
      publicTransport: 0,
      recreation: 0,
      schools: 0,
    };
    let comments: string[] = [];

    let ageDistribution: Record<string, number> = {};
    let occupationDistribution: Record<string, number> = {};

    for (const doc of allDocsMap.values()) {
      const survey = doc.data() as ISurvey;

      for (const key in ratingsSum) {
        const ratingKey = key as keyof IRating;
        if (survey.ratings[ratingKey] !== undefined) {
          ratingsSum[ratingKey] += survey.ratings[ratingKey]!;
        }
      }

      for (const key in amenitiesSum) {
        const amenitiesKey = key as keyof IAmenity;
        if (survey.amenities[amenitiesKey] !== undefined) {
          amenitiesSum[amenitiesKey] += survey.amenities[amenitiesKey]!;
        }
      }

      const ageGroup = getAgeGroup(survey.age);
      ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;

      const occupation = survey.occupation.toLowerCase();
      occupationDistribution[occupation] =
        (occupationDistribution[occupation] || 0) + 1;

      ratingsCount++;
      if (
        survey.comments &&
        typeof survey.comments === 'string' &&
        survey.comments.trim() !== ''
      ) {
        comments.push(survey.comments.trim());
      }
    }

    const ratingsAvg = Object.fromEntries(
      Object.entries(ratingsSum).map(([k, v]) => [k, v / ratingsCount])
    );

    const amenitiesAvg = Object.fromEntries(
      Object.entries(amenitiesSum).map(([k, v]) => [k, v / ratingsCount])
    );

    res.json({
      success: true,
      stats: {
        ratingsAvg,
        amenitiesAvg,
        ageDistribution,
        occupationDistribution,
        comments,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRatingsOverTime = async (req: Request, res: Response) => {
  try {
    const { locality } = req.query;
    if (!locality) {
      return res
        .status(400)
        .json({ error: 'locality query parameter is required' });
    }
    const normalizedLoc = String(locality).toLowerCase();

    const snapshots = await Promise.all([
      db
        .collection('surveys')
        .where('locality.state', '==', normalizedLoc)
        .get(),
      db
        .collection('surveys')
        .where('locality.city', '==', normalizedLoc)
        .get(),
      db
        .collection('surveys')
        .where('locality.area', '==', normalizedLoc)
        .get(),
      db
        .collection('surveys')
        .where('locality.pincode', '==', normalizedLoc)
        .get(),
    ]);

    const docsMap = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
    snapshots.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        docsMap.set(doc.id, doc);
      });
    });

    if (docsMap.size === 0) {
      return res.json({ success: true, data: [] });
    }

    const dailyRatingsMap = new Map<
      string,
      {
        cleanlinessSum: number;
        airQualitySum: number;
        waterQualitySum: number;
        noiseLevelSum: number;
        count: number;
      }
    >();

    docsMap.forEach((doc) => {
      const data = doc.data();
      const date = data.createdAt.toDate().toISOString().slice(0, 10);

      const entry = dailyRatingsMap.get(date) || {
        cleanlinessSum: 0,
        airQualitySum: 0,
        waterQualitySum: 0,
        noiseLevelSum: 0,
        count: 0,
      };

      entry.cleanlinessSum += data.ratings.cleanliness || 0;
      entry.airQualitySum += data.ratings.airQuality || 0;
      entry.waterQualitySum += data.ratings.waterQuality || 0;
      entry.noiseLevelSum += data.ratings.noiseLevel || 0;
      entry.count += 1;
      dailyRatingsMap.set(date, entry);
    });

    const result = Array.from(dailyRatingsMap.entries())
      .map(([date, sums]) => ({
        date,
        cleanliness: sums.cleanlinessSum / sums.count,
        airQuality: sums.airQualitySum / sums.count,
        waterQuality: sums.waterQualitySum / sums.count,
        noiseLevel: sums.noiseLevelSum / sums.count,
      }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
