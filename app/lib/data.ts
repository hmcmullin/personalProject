// marker information structure
export type MarkerData = {
  id: string;
  userId: string;
  objType: "marker";
  lat: number;
  lng: number;
  title: string;
  activity: string;
  color: string;
  dateCreated: string;
};

// line information structure
export type LineData = {
  id: string;
  userId: string;
  objType: "line";
  title: string;
  lat: number;
  lng: number;
  notes: string;
  dateCreated: Date;
  color: string;
  geoJson: string;
};

// shape information structure
export type ShapeData = {
  id: string;
  userId: string;
  objType: "shape";
  title: string;
  lat: number;
  lng: number;
  notes: string;
  dateCreated: Date;
  color: string;
  geoJson: string;
};

// Form state structure for signup and recovery forms
export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        recoveryCode?: string[];
        newPassword?: string[];
      };
      message?: string;
      recoveryCodeToShow?: string;
      newRecoveryCodeToShow?: string;
    }
  | undefined;
