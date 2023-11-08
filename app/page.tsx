"use client";
import { useState, useEffect } from "react";
import { CustomFilter, Hero, SearchBar, CarCard, ShowMore } from "@/components";
import { fuels, yearsOfProduction } from "@/constants";
import { HomeProps } from "@/types";
import { fetchCars } from "@/utils";
import Image from "next/image";
export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);
  //search states
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  //filter states
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2023);
  //pagination state
  const [limit, setLimit] = useState(10);
  //const { manufacturer, year, fuel, limit, model } = searchParams;

  const getCars = async () => {
    setLoading(true);
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || 2023,
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });
      setAllCars(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Effected: ", fuel, model, limit, manufacturer, year);
    getCars();
  }, [fuel, model, limit, manufacturer, year]);

  // const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="font-extrabold text-4xl">Car Catalogue</h1>
          <p>Explore the car that you may like</p>
        </div>
        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>
            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image
                  src={"/loader.svg"}
                  width={50}
                  height={50}
                  alt="loading"
                  className="object-contain"
                />
              </div>
            )}
            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no result!</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
