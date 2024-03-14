/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Label, Modal, Radio } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../server/supabase";

interface SelectGroupModalProps {
  openModal: boolean;
  closeModal: () => void;
  user: any;
  groupSelected?: string;
}

export const SelectGroupModal = (props: SelectGroupModalProps) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState(
    props.groupSelected ? props.groupSelected : "",
  );

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    const fetchData = async () => {
      const groupsDb = await supabase
        .from("users_groups")
        .select("*,groups(*)")
        .eq("user_id", props.user.id);
      if (groupsDb && groupsDb.data) {
        setUserGroups(groupsDb.data);
        if (groupsDb.data && groupsDb.data.length === 1) {
          setSelectedGroup(groupsDb.data[0].groups!.id);
          localStorage.setItem("groupSelected", groupsDb.data[0].groups!.id);
          navigate("/");
          setIsOpen(false);
          props.closeModal();
        }
      }
    };
    fetchData();
  }, []);

  const login = () => {
    if (!props.groupSelected) {
      if (selectedGroup !== "") {
        localStorage.setItem("groupSelected", selectedGroup);
        setIsOpen(false);
        props.closeModal();
        navigate("/");
      }
    } else {
      localStorage.setItem("groupSelected", selectedGroup);
      setIsOpen(false);
      props.closeModal();
    }
  };

  return (
    <>
      {userGroups && userGroups.length > 1 && (
        <Modal size={"xl"} show={isOpen}>
          <Modal.Body className="max-h-[60vh]">
            <div className="p-4">
              <strong> Selecciona el grupo con el que operar: </strong>
            </div>

            {userGroups.length > 0 &&
              userGroups.map((group, index) => (
                <div className="px-6 mt-1" key={index}>
                  <Radio
                    name="groups"
                    checked={selectedGroup === group.groups.id}
                    value={group.groups.id}
                    onChange={(e) => setSelectedGroup(e.currentTarget.value)}
                  />
                  <Label className="ml-2">{group.groups.title}</Label>
                </div>
              ))}
            <Button
              className="w-full mt-10"
              onClick={login}
              color="primary"
              disabled={selectedGroup === ""}
            >
              Acceder
            </Button>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
