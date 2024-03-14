/* eslint-disable @typescript-eslint/no-explicit-any */
interface PriorityComponentProps {
  priority: any;
}
export const PriorityComponent = (props: PriorityComponentProps) => {
  return (
    <div>
      {props.priority === 0 ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-amber-100 rounded-full">
          <label className="font-medium text-amber-800">Baja</label>
        </div>
      ) : props.priority === 1 ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-200 rounded-full">
          <label className="font-medium text-yellow-800">Normal</label>
        </div>
      ) : props.priority === 2 ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-orange-200 rounded-full">
          <label className="font-medium text-orange-800">Alta</label>
        </div>
      ) : props.priority === 3 ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-red-300 rounded-full">
          <label className="font-medium text-red-800">Urgente</label>
        </div>
      ) : null}
    </div>
  );
};
