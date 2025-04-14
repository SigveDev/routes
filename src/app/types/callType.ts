export type Calls = {
  realtime: boolean;
  aimedArrivalTime: string;
  aimedDepartureTime: string;
  expectedArrivalTime: string;
  expectedDepartureTime: string;
  actualArrivalTime: string | null;
  actualDepartureTime: string | null;
  date: string;
  forBoarding: boolean;
  forAlighting: boolean;
  destinationDisplay: {
    frontText: string;
  };
  quay: {
    id: string;
  };
  serviceJourney: {
    journeyPattern: {
      line: {
        id: string;
        name: string;
        transportMode: string;
      };
    };
  };
};
