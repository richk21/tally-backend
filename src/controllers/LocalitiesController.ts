import { Request, Response } from 'express';
import db from '../firebase/admin';
import { capitalizeArray } from '../utils/capitalize';

async function getDistinctFieldValues(fieldName: string) {
  const snapshot = await db.collection(fieldName).get();
  const valuesSet = new Set<string>();

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.value) {
      valuesSet.add(data.value);
    }
  });

  return Array.from(valuesSet).sort();
}

export const getStates = async (req: Request, res: Response) => {
  try {
    const states = await getDistinctFieldValues('localities_states');
    res.json(capitalizeArray(states));
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await getDistinctFieldValues('localities_cities');
    res.json(capitalizeArray(cities));
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAreas = async (req: Request, res: Response) => {
  try {
    const areas = await getDistinctFieldValues('localities_areas');
    res.json(capitalizeArray(areas));
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPincodes = async (req: Request, res: Response) => {
  try {
    const pincodes = await getDistinctFieldValues('localities_pincodes');
    res.json(pincodes);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
