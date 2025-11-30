import axios from "axios";

interface ReverseGeoResponse {
  display_name?: string;
}

export const reverseGeocode = async (longitude: number, latitude: number): Promise<string> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await axios.get<ReverseGeoResponse>(url, {
      headers: {
        "User-Agent": "medixcamp-app/1.0",
      },
    });

    return response.data.display_name || "Unknown Location";
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return "Unknown Location";
  }
};
