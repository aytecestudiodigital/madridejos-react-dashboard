/* eslint-disable @typescript-eslint/no-explicit-any */
interface PriorityComponentProps {
  priority: any;
}
export const PriorityComponent = (props: PriorityComponentProps) => {
  return (
    <div>
      {props.priority === 0 ? (
        <div>Baja</div>
      ) : props.priority === 1 ? (
        <div>Normal</div>
      ) : props.priority === 2 ? (
        <div>Alta</div>
      ) : props.priority === 3 ? (
        <div>Urgente</div>
      ) : null}
    </div>
  );
};
