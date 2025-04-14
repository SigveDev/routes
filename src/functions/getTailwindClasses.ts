export function getTailwindClasses(type: string): string {
  switch (type) {
    case "bus":
      return "bg-red-600 text-white font-bold rounded-lg h-8 w-16 p-2 text-center flex justify-center items-center";
    case "rail":
      return "bg-green-400 text-white font-bold rounded-lg h-8 w-16 p-2 text-center flex justify-center items-center";
    default:
      return "bg-blue-500 text-white font-bold rounded-lg h-8 w-16 p-2 text-center flex justify-center items-center";
  }
}
