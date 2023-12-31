import React, { createContext, useState } from "react";
import Attibutes from "../steps/Attibutes";
import ARIDetails from "../steps/ARIDetails";
import AdressDetails from "../steps/AdressDetails";
import Description from "../steps/Description";
import db from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const StepContext = createContext();

const StepsProvider = ({ children }) => {
  const renderSwitch = (param) => {
    switch (param) {
      case 1:
        return <Attibutes></Attibutes>;
      case 2:
        return <ARIDetails></ARIDetails>;
      case 3:
        return <AdressDetails></AdressDetails>;
      case 4:
        return <Description></Description>;
      default:
        return <Attibutes></Attibutes>;
    }
  };

  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    name: "",
    email: "",
    number: "",
    gender: "",
    country: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    desc: "",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    number: false,
    gender: false,
    country: false,
    street: false,
    city: false,
    state: false,
    zip: false,
    desc: false,
  });

  const [oldValues, setOldValues] = useState({});

  const handleEdit = (fieldName) => {
    setOldValues((prevOldValues) => ({
      ...prevOldValues,
      [fieldName]: values[fieldName],
    }));
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [fieldName]: true,
    }));
  };

  const handleCancel = (fieldName) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [fieldName]: false,
    }));
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: oldValues[fieldName], // Revert to the old value
    }));
  };

  const handleSave = async (fieldName) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [fieldName]: false,
    }));
    const querySnapshot = await getDocs(collection(db, "userData"));
    querySnapshot.forEach(async (docs) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      const docID = docs.id;
      const washingtonRef = doc(db, "userData", docID);
      await updateDoc(washingtonRef, {
        [fieldName]: values[fieldName],
      });
    });
  };

  const handleChange = (fieldName, e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: e.target.value,
    }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log("function submit");
    const result = await addDoc(collection(db, "userData"), {
      name: values.name,
      email: values.email,
      number: values.number,
      gender: values.gender,
      country: values.country,
      street: values.street,
      city: values.city,
      state: values.state,
      zip: values.zip,
      desc: values.desc,
    });
    console.log(result);
  };

  const getAllData = async () => {
    const querySnapshot = await getDocs(collection(db, "userData"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      setValues(doc.data());
    });
  };

  return (
    <StepContext.Provider
      value={{
        values,
        editMode,
        renderSwitch,
        step,
        setStep,
        handleEdit,
        handleCancel,
        handleSave,
        handleChange,
        handleNext,
        handleBack,
        handleSubmit,
        getAllData,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export { StepContext, StepsProvider };
