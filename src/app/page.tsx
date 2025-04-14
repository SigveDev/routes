"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TableRoutesRenderer from "./components/tableRoutesRenderer";
import { StopPlaceQueryResponseWrapper } from "./types/stopPlaceQueryResponse";
import Skeleton from "./components/skeleton";
import { format } from "date-fns";
import { WeatherIcon } from "./components/weatherIcon";

export default function Home() {
  const {
    isLoading: routesLoading,
    data: routesData,
    isError: routesError,
  } = useQuery<StopPlaceQueryResponseWrapper>({
    queryKey: ["routes"],
    queryFn: async () => {
      const response = await axios.post(
        "https://api.entur.io/journey-planner/v3/graphql",
        {
          query: `# Avgangstavle

{
  stopPlaces(ids: ["NSR:StopPlace:3494", "NSR:StopPlace:3515", "NSR:StopPlace:58853"]) {
    id
    name
    estimatedCalls(timeRange: 72100, numberOfDepartures: 25) {
      realtime
      expectedDepartureTime
      destinationDisplay {
        frontText
      }
      quay {
        id
      }
      serviceJourney {
        journeyPattern {
          line {
            id
            name
            transportMode
          }
        }
      }
    }
  }
}
          `,
          variables: {},
        }
      );
      return response.data;
    },
    refetchInterval: 60000,
  });

  const {
    isLoading: weatherLoading,
    data: weatherData,
    isError: weatherError,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${process.env.NEXT_PUBLIC_LATITUDE}&lon=${process.env.NEXT_PUBLIC_LONGITUDE}`
      );
      const timeseries = response.data.properties.timeseries;
      const currentTime = new Date();

      const closestFutureTime = timeseries.reduce(
        (
          closest: { time: string | number | Date },
          current: { time: string | number | Date }
        ) => {
          const currentTimeDiff =
            new Date(current.time).getTime() - currentTime.getTime();
          const closestTimeDiff =
            new Date(closest.time).getTime() - currentTime.getTime();

          if (
            currentTimeDiff >= 0 &&
            (closestTimeDiff < 0 || currentTimeDiff < closestTimeDiff)
          ) {
            return current;
          }

          return closest;
        },
        timeseries[0]
      );

      return closestFutureTime;
    },
    refetchInterval: 300000,
  });

  return (
    <div className="w-full h-full p-12 bg-black grid grid-rows-7 grid-cols-2 gap-4">
      <div className="bg-gray-950 border-2 border-gray-700 rounded-2xl text-gray-50 col-span-1 row-span-1 flex items-center justify-between p-4">
        {weatherLoading ? (
          <Skeleton className="w-full h-14 rounded-lg" />
        ) : (
          <div className="flex items-center justify-center gap-8 w-full">
            <h2 className="text-5xl font-bold mb-1">
              {weatherData?.data.instant.details.air_temperature}°C
            </h2>
            <WeatherIcon
              weatherType={weatherData?.data.next_1_hours.summary.symbol_code}
              size={64}
            />
          </div>
        )}
      </div>
      <div className="bg-gray-950 border-2 border-gray-700 rounded-2xl text-gray-50 col-span-1 row-span-1 flex items-center justify-between p-4">
        <div className="flex items-center justify-center w-full">
          <h2 className="text-6xl font-bold mb-1">
            {format(new Date(), "HH:mm")}
          </h2>
        </div>
      </div>
      <TableRoutesRenderer
        stopName={routesData?.data.stopPlaces[0].name || ""}
        calls={routesData?.data.stopPlaces[0].estimatedCalls || []}
        linePlatformFilter={[
          { lineId: "83", platformId: "6202" },
          { lineId: "84", platformId: "6202" },
          { lineId: "580", platformId: "6203" },
        ]}
        className="col-span-2 row-span-2"
      />
      <TableRoutesRenderer
        stopName={routesData?.data.stopPlaces[1].name || ""}
        calls={routesData?.data.stopPlaces[1].estimatedCalls || []}
        linePlatformFilter={[{ lineId: "81", platformId: "6244" }]}
        className="col-span-2 row-span-2"
      />
      <TableRoutesRenderer
        stopName={routesData?.data.stopPlaces[2].name || ""}
        calls={routesData?.data.stopPlaces[2].estimatedCalls || []}
        linePlatformFilter={[
          { lineId: "L2", platformId: "936" },
          { lineId: "L2", platformId: "937" },
        ]}
        className="col-span-2 row-span-2"
      />
    </div>
  );
}
