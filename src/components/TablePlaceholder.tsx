import { Table } from "flowbite-react";
import { Placeholder } from "semantic-ui-react";

export const TablePlaceholder = () => {
  return [...Array(15).keys()].map((item) => (
    <Table.Row key={item}>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Table.Cell>
    </Table.Row>
  ));
};
