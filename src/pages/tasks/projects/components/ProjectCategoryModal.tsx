import {
  Button,
  Checkbox,
  Dropdown,
  Label,
  Modal,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProjectCategoryModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  technicians: any[];
  item: any;
  onCreateCategory: (data: any) => void;
  onUpdateCategory: (data: any) => void;
}

export const ProjectCategoryModal = (props: ProjectCategoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTechnicians, setSelectedTechnicians] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [autoAssign, setAutoAssign] = useState(false);
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (props.item) {
      const techs: any = [];
      setTitle(props.item.title);
      setDescription(props.item.description);
      setAutoAssign(props.item.auto_assign);
      setEnable(props.item.enabled);
      if (props.item.techniciansSelected.length > 0) {
        props.item.techniciansSelected.forEach((tech: any) => {
          techs.push(tech);
        });
      }
      setSelectedTechnicians(techs);
    }
  }, [props.item]);

  const close = () => {
    setIsOpen(false);
    props.onCloseModal();
  };

  const handleTechnicianChange = (state: string, checked: boolean) => {
    if (checked) {
      const selected = [...selectedTechnicians, state];
      setSelectedTechnicians(selected);
    } else {
      const selected = selectedTechnicians.filter((s) => s != state);
      setSelectedTechnicians(selected);
    }
  };

  const onSubmit = () => {
    const category: any = {
      title: title,
      description: description,
      techniciansSelected: [...selectedTechnicians],
      auto_assign: autoAssign,
      enabled: enable,
    };
    if (!props.item) {
      props.onCreateCategory(category);
    } else {
      category.id = props.item.id;
      props.onUpdateCategory(category);
    }
    close();
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen} className="z-40">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Añadir/Editar categoría</strong>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Label>Título de la categoría *</Label>
          <div className="mt-1">
            <TextInput
              defaultValue={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="Introduce el título de la categoría"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label>Descripción</Label>
          <div className="mt-1">
            <Textarea
              defaultValue={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              placeholder="Introduce descripción de la categoría"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label>Técnicos</Label>
          <div className="mt-1">
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <button
                  id="dropdownBgHoverButton"
                  data-dropdown-toggle="dropdownBgHover"
                  className="flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
                  type="button"
                >
                  <span>Técnicos</span>
                  <svg
                    className="ml-4 h-4 w-4 py-1 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 2 4 4 4-4"
                    />
                  </svg>
                </button>
              )}
            >
              {props.technicians && props.technicians.length > 0
                ? props.technicians.map((technician) => (
                    <Dropdown.Item key={technician.id}>
                      <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <Checkbox
                          id={`checkbox-item-${technician.id}`}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          checked={selectedTechnicians.includes(technician.id)}
                          onChange={(e) =>
                            handleTechnicianChange(
                              technician.id,
                              e.target.checked,
                            )
                          }
                        />
                        <label className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                          {technician.name}
                        </label>
                      </div>
                    </Dropdown.Item>
                  ))
                : null}
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <Checkbox
              checked={autoAssign}
              onChange={(e) => setAutoAssign(e.currentTarget.checked)}
            />
            <Label className="ml-2">Asignación automática</Label>
          </div>
          <div className="mt-1">
            <ToggleSwitch
              checked={enable}
              onChange={(e) => setEnable(e)}
              label="Habilitado"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex place-content-end">
        <Button
          disabled={
            (autoAssign && selectedTechnicians.length === 0) || title === ""
          }
          size={"sm"}
          onClick={onSubmit}
          color="primary"
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
