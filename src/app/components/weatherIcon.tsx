import {
  LucideIcon,
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudSnow,
} from "lucide-react";
import { JSX } from "react";

export function WeatherIcon({
  weatherType,
  color = "white",
  size = 48,
  strokeWidth = 2,
}: {
  weatherType: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}): JSX.Element {
  const Icon: LucideIcon = (() => {
    switch (weatherType) {
      case "clearsky_day":
      case "fair_day":
        return Sun;
      case "clearsky_night":
      case "fair_night":
        return Moon;
      case "partlycloudy_day":
        return CloudSun;
      case "partlycloudy_night":
        return CloudMoon;
      case "cloudy":
      case "fog":
        return Cloud;
      case "lightrainshowers_day":
      case "lightrainshowers_night":
      case "rainshowers_day":
      case "rainshowers_night":
      case "heavyrainshowers_day":
      case "heavyrainshowers_night":
      case "lightrain":
      case "rain":
      case "heavyrain":
        return CloudRain;
      case "lightrainshowersandthunder_day":
      case "lightrainshowersandthunder_night":
      case "rainshowersandthunder_day":
      case "rainshowersandthunder_night":
      case "heavyrainshowersandthunder_day":
      case "heavyrainshowersandthunder_night":
      case "lightrainandthunder":
      case "rainandthunder":
      case "heavyrainandthunder":
        return CloudLightning;
      case "lightsleetshowers_day":
      case "lightsleetshowers_night":
      case "lightsleet":
      case "sleet":
      case "heavysleet":
        return CloudSnow;
      case "lightsnowshowers_day":
      case "lightsnowshowers_night":
      case "snowshowers_day":
      case "snowshowers_night":
      case "heavysnowshowers_day":
      case "heavysnowshowers_night":
      case "lightsnow":
      case "snow":
      case "heavysnow":
        return CloudSnow;
      default:
        return Cloud;
    }
  })();

  return <Icon color={color} size={size} strokeWidth={strokeWidth} />;
}
