"use client";
import { useState } from "react";
import { classNames } from "../../../../lib/functions/classNames";
import { MapType } from "./components/MapType";
import { SelectActivities } from "./components/SelectActivities";

export default function NewMap() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (currentStep == 0) {
    return (
      <MapType
        onSelectType={(type: "future" | "past") => {
          if (type == "past") {
            setCurrentStep(1);
          } else {
            setCurrentStep(2);
          }
        }}
      />
    );
  }
  if (currentStep == 1) {
    return <SelectActivities />;
  }
}
