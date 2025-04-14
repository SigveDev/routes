"use client";
import { useEffect, useState } from "react";
import { Calls } from "../types/callType";
import { FormatedCall } from "../types/formatedCallType";
import { format } from "date-fns";
import { cn } from "@/functions/cn";
import { getTailwindClasses } from "../../functions/getTailwindClasses";
import Skeleton from "./skeleton";
import { LinePlatformFilterType } from "../types/linePlatformFilterType";

export default function TableRoutesRenderer({
  stopName,
  calls,
  linePlatformFilter,
  className,
}: {
  stopName: string;
  calls: Calls[];
  linePlatformFilter?: LinePlatformFilterType[];
  className?: string;
}) {
  const [formatedCalls, setFormatedCalls] = useState<FormatedCall[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCalls = () => {
    const filteredCalls = calls.filter((call) => {
      const platformMatch = linePlatformFilter
        ? linePlatformFilter.some(
            (filter) =>
              filter.platformId === call.quay.id.split(":")[2] &&
              filter.lineId ===
                call.serviceJourney.journeyPattern.line.id.split(":")[2]
          )
        : true;
      return platformMatch;
    });

    const formatted = filteredCalls.map((call) => {
      const countdown =
        Math.abs(
          new Date(call.expectedDepartureTime).getTime() - new Date().getTime()
        ) / 60000;
      const showCountdown = call.realtime && countdown < 30;

      return {
        lineId: call.serviceJourney.journeyPattern.line.id.split(":")[2],
        line: call.serviceJourney.journeyPattern.line.name,
        lineName: `${
          call.serviceJourney.journeyPattern.line.id.split(":")[2]
        } - 
          ${call.destinationDisplay.frontText}`,
        destination: call.destinationDisplay.frontText,
        currentDepartureTime: call.expectedDepartureTime,
        type: call.serviceJourney.journeyPattern.line.transportMode,
        realtime: call.realtime,
        showCountdown: showCountdown,
        countdown: countdown,
      };
    });
    setFormatedCalls(formatted);
    setLoading(false);
  };

  const updateCountdowns = () => {
    setFormatedCalls((prevCalls) =>
      prevCalls.map((call) => {
        const countdown =
          Math.abs(
            new Date(call.currentDepartureTime).getTime() - new Date().getTime()
          ) / 60000;
        const showCountdown = call.realtime && countdown < 30;

        return {
          ...call,
          countdown: countdown,
          showCountdown: showCountdown,
        };
      })
    );
  };

  useEffect(() => {
    formatCalls();
  }, [calls]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdowns();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "w-full h-full p-4 bg-gray-950 border-2 border-gray-700 rounded-2xl text-gray-50 overflow-hidden",
        className
      )}
    >
      {loading ? (
        <Skeleton className="w-1/2 h-12 rounded-lg" />
      ) : (
        <h2 className="text-4xl font-bold">{stopName}</h2>
      )}
      <table className="w-full h-full mt-4 text-gray-50 table-fixed">
        <thead>
          <tr className="bg-gray-800 text-gray-50">
            <th className="text-left pl-4 py-2 rounded-l-lg w-4/5">Line</th>
            <th className="text-left pr-4 py-2 rounded-r-lg w-1/5">
              Departure
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="flex items-center h-full pl-4 py-2 gap-4">
                <Skeleton className="w-1/2 h-6 rounded-lg" />
              </td>
              <td className="text-left pr-4 py-2">
                <Skeleton className="w-1/2 h-6 rounded-lg" />
              </td>
            </tr>
          ) : (
            formatedCalls.map((call, index) => (
              <tr key={index}>
                <td className="flex items-center h-full pl-4 py-2 gap-4">
                  <div
                    className={cn("text-left", getTailwindClasses(call.type))}
                  >
                    {call.lineId}
                  </div>
                  <span className="text-lg text-white font-bold">
                    {call.destination}
                  </span>
                </td>
                <td className="text-left pr-4 py-2">
                  {call.showCountdown ? (
                    <span
                      className={cn(
                        "font-bold",
                        call.countdown <= 3
                          ? "text-red-500"
                          : call.countdown <= 5
                          ? "text-yellow-500"
                          : "text-white"
                      )}
                    >
                      {call.countdown <= 0.9
                        ? "now"
                        : `${Math.floor(call.countdown)} min`}
                    </span>
                  ) : call.realtime ? (
                    <span className="text-white font-bold">
                      {format(new Date(call.currentDepartureTime), "HH:mm")}
                    </span>
                  ) : (
                    <span className="text-gray-600 font-bold">
                      {format(new Date(call.currentDepartureTime), "HH:mm")}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
