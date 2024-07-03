import { createContext, useState, useContext, useEffect } from "react";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscribedPlan, setSubscribedPlan] = useState("");
  const [subscribedPlans, setSubscribedPlans] = useState([]);
  const [cancelledPlans, setCancelledPlans] = useState([]);
  const [credits, setCredits] = useState(0);
  const [videoConversion, setVideoConversion] = useState(0);
  const [audioConversion, setAudioConversion] = useState(0);

  useEffect(() => {
    // Load initial state from localStorage if available
    const storedSubscribedPlan = localStorage.getItem("subscribedPlan");
    const storedSubscribedPlans =
      JSON.parse(localStorage.getItem("subscribedPlans")) || [];
    const storedCancelledPlans =
      JSON.parse(localStorage.getItem("cancelledPlans")) || [];
    const storedCredits = parseInt(localStorage.getItem("credits"), 10) || 0;
    const storedVideoConversion =
      parseInt(localStorage.getItem("videoConversion"), 10) || 0;
    const storedAudioConversion =
      parseInt(localStorage.getItem("audioConversion"), 10) || 0;

    setSubscribedPlan(storedSubscribedPlan || "");
    setSubscribedPlans(storedSubscribedPlans);
    setCancelledPlans(storedCancelledPlans);
    setCredits(storedCredits);
    setVideoConversion(storedVideoConversion);
    setAudioConversion(storedAudioConversion);
  }, []); 

  const updateSubscriptionPlan = (
    newSubscribedPlan,
    newSubscribedPlans,
    newCancelledPlans,
    newCredits,
    newVideoConversion,
    newAudioConversion
  ) => {
    setSubscribedPlan(newSubscribedPlan);
    setSubscribedPlans(newSubscribedPlans);
    setCancelledPlans(newCancelledPlans);
    setCredits(newCredits);
    setVideoConversion(newVideoConversion);
    setAudioConversion(newAudioConversion);

    // Update localStorage
    localStorage.setItem("subscribedPlan", newSubscribedPlan);
    localStorage.setItem("subscribedPlans", JSON.stringify(newSubscribedPlans));
    localStorage.setItem("cancelledPlans", JSON.stringify(newCancelledPlans));
    localStorage.setItem("credits", newCredits);
    localStorage.setItem("videoConversion", newVideoConversion);
    localStorage.setItem("audioConversion", newAudioConversion);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscribedPlan,
        subscribedPlans,
        cancelledPlans,
        credits,
        videoConversion,
        audioConversion,
        setSubscribedPlans,
        setCancelledPlans,
        updateSubscriptionPlan,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
