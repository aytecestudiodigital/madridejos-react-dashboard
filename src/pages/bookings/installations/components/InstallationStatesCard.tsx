import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InstallationStatesModel } from "../models/InstallationStatesModel";
import { InstallationStateColor } from "./InstallationStateColor";
import { NewStateModal } from "./NewStateModal";

interface InstallationStatesCardProps {
  states: InstallationStatesModel[];
  setStates: any;
  newInstallation: boolean;
}
export const InstallationStatesCard = ({
  newInstallation,
  states,
  setStates,
}: InstallationStatesCardProps) => {
  const { t } = useTranslation();

  const [installationStates, setInstallationStates] = useState<
    InstallationStatesModel[]
  >([]);
  useEffect(() => {
    let colorsByIds: any = {};
    installationStates.forEach((state) => {
      colorsByIds[state.id!] = state.color;
    });

    if (states.length === 0 && !newInstallation) {
      const initialStates = [
        {
          title: "Libre",
          enable: true,
          bookeable: true,
          color: "#8bc34a",
        },
        {
          title: "Ocupado",
          enable: true,
          bookeable: false,
          color: "#607d8b",
        },
      ];

      setInstallationStates(initialStates);
      setStates(initialStates);
    }
    setInstallationStates(states);
  }, [states]);

  const onSaveState = (
    state: InstallationStatesModel,
    title: string,
    color: string,
    bookeable: boolean,
  ) => {
    // Busca el índice del estado en el array states
    const index = states.findIndex((s) => s.id === state.id);

    if (index !== -1) {
      // Actualiza el estado existente con las nuevas propiedades
      const updatedStates = [...states];
      updatedStates[index] = {
        ...state,
        title,
        color,
        bookeable,
      };

      // Actualiza el estado y la variable de estado
      setStates(updatedStates);
      setInstallationStates(updatedStates);
    }
  };

  const onNewState = (title: string, color: string, bookeable: boolean) => {
    const newState: InstallationStatesModel = {
      title,
      color,
      bookeable,
    };

    setInstallationStates((prev) => {
      return [...prev, newState];
    });

    setStates((prev: InstallationStatesModel[]) => [...prev, newState]);
  };

  const onDeleteState = (stateToDelete: InstallationStatesModel) => {
    setInstallationStates((prev) => {
      const newStates = [];
      for (const ins of prev) {
        if (ins !== stateToDelete) {
          newStates.push(ins);
        }
      }

      setStates(newStates);
      return newStates;
    });
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-4 p-1">
        <h3 className="text-xl font-bold dark:text-white">
          {t("INSTALLATION_PAGE_STATES")}
        </h3>
        <NewStateModal onSave={onNewState} />
      </div>
      {installationStates.map((state, index) => (
        <InstallationStateColor
          key={index}
          state={state}
          onSave={(title, color, bookeable) =>
            onSaveState(state, title, color, bookeable)
          }
          onDelete={onDeleteState}
        />
      ))}
    </div>
  );
};
