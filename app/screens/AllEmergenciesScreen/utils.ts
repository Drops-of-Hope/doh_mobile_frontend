import { Emergency, EmergencyStats } from "./types";

export const getAllEmergencies = (): Emergency[] => {
  return [
    {
      id: 1,
      hospital: "City General Hospital",
      bloodType: "O+ Needed",
      slotsUsed: 3,
      totalSlots: 10,
      urgency: "Critical",
      timeLeft: "2 hours left",
      description:
        "Critical shortage of O+ blood needed for emergency surgeries. Multiple patients in the ICU require immediate blood transfusions.",
      contactNumber: "+94 11 123 4567",
      address: "123 Main Street, Colombo 07",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
    {
      id: 2,
      hospital: "Negombo General Hospital",
      bloodType: "AB+ Needed",
      slotsUsed: 5,
      totalSlots: 8,
      urgency: "Critical",
      timeLeft: "4 hours left",
      description:
        "Urgent need for AB+ blood type for accident victims. Road traffic accident has resulted in multiple casualties requiring immediate medical attention.",
      contactNumber: "+94 31 234 5678",
      address: "456 Hospital Road, Negombo",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
    {
      id: 3,
      hospital: "Kandy Teaching Hospital",
      bloodType: "O+ Needed",
      slotsUsed: 2,
      totalSlots: 6,
      urgency: "Moderate",
      timeLeft: "8 hours left",
      description:
        "O+ blood type needed for surgery patient. Limited stock available and surgery scheduled tomorrow morning.",
      contactNumber: "+94 81 234 5678",
      address: "789 Peradeniya Road, Kandy",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
    {
      id: 4,
      hospital: "Galle District Hospital",
      bloodType: "AB+ Needed",
      slotsUsed: 1,
      totalSlots: 4,
      urgency: "Low",
      timeLeft: "12 hours left",
      description:
        "AB+ blood needed for planned surgery. Patient scheduled for operation and needs blood backup.",
      contactNumber: "+94 91 234 5678",
      address: "321 Galle Road, Galle",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
    {
      id: 5,
      hospital: "Jaffna Teaching Hospital",
      bloodType: "O+ Needed",
      slotsUsed: 4,
      totalSlots: 5,
      urgency: "Critical",
      timeLeft: "1 hour left",
      description:
        "O+ blood urgently needed for trauma patient. Emergency surgery in progress.",
      contactNumber: "+94 21 234 5678",
      address: "654 Hospital Street, Jaffna",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
    {
      id: 6,
      hospital: "Anuradhapura Teaching Hospital",
      bloodType: "AB+ Needed",
      slotsUsed: 1,
      totalSlots: 3,
      urgency: "Moderate",
      timeLeft: "6 hours left",
      description:
        "AB+ blood type needed for maternal emergency. Expecting mother requires blood support for safe delivery.",
      contactNumber: "+94 25 234 5678",
      address: "987 Old Road, Anuradhapura",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
    {
      id: 7,
      hospital: "Batticaloa District Hospital",
      bloodType: "O+ Needed",
      slotsUsed: 0,
      totalSlots: 3,
      urgency: "Low",
      timeLeft: "24 hours left",
      description:
        "O+ blood needed for scheduled surgery tomorrow. Elective procedure requires blood backup availability.",
      contactNumber: "+94 65 234 5678",
      address: "159 Coastal Road, Batticaloa",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
  ];
};

export const getEmergencyStats = (emergencies: Emergency[]): EmergencyStats => {
  const critical = emergencies.filter((e) => e.urgency === "Critical").length;
  const moderate = emergencies.filter((e) => e.urgency === "Moderate").length;
  const low = emergencies.filter((e) => e.urgency === "Low").length;

  return { critical, moderate, low, total: emergencies.length };
};
