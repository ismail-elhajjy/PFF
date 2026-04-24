import casaImg from "../assets/Casablanca.jpg";
import rabatImg from "../assets/Rabat.jpg";
import marrakechImg from "../assets/marrakech.jpg";
import tangerImg from "../assets/tanger.jpg";
import agadirImg from "../assets/agadir.jpg";
import fesImg from "../assets/fes.jpg";
import chefchaouenImg from "../assets/chefchaouen.jpg";
import EssaouiraImg from "../assets/essaouira.jpg";

const CitiesData = [
  { cityName: "Casablanca",  photo: casaImg,        status: "High Demand"   },
  { cityName: "Rabat",       photo: rabatImg,       status: "High Demand"   },
  { cityName: "Marrakech",   photo: marrakechImg,   status: "High Demand" },
  { cityName: "Tanger",      photo: tangerImg,      status: "Available Now" },
  { cityName: "Agadir",      photo: agadirImg,      status: "Available Now" },
  { cityName: "Fes",         photo: fesImg,         status: "Limited Spots" },
  { cityName: "Chefchaouen", photo: chefchaouenImg, status: "Limited Spots" },
  { cityName: "Essaouira",   photo: EssaouiraImg,   status: "Limited Spots" },
  
];

export default CitiesData;
