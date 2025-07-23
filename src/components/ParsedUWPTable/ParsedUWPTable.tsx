import React from 'react';
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components';
import type { UWPDetails } from '../../uwp-parser/types';
import s from './ParsedUWPTable.module.css';

const ParsedUWPTable: React.FC<{ parsedUWP: UWPDetails | null }> = ({ parsedUWP }) => {
  if (!parsedUWP) return null;

  const flatData = Object.entries(parsedUWP).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        acc.push({ parameter: key, code: item.code, description: item.description });
      });
    } else {
      acc.push({ parameter: key, code: value.code, description: value.description });
    }
    return acc;
  }, [] as { parameter: string; code: string; description: string }[]);

  return (
    <Table data-testid="parsed-uwp-table" className={s.table} aria-label="UWP Data">
      <TableHeader>
        <Column isRowHeader>Parameter</Column>
        <Column>Code</Column>
        <Column>Description</Column>
      </TableHeader>
      <TableBody>
        {flatData.map(({ parameter, code, description }) => (
          <Row key={`${parameter}-${code}`}>
            <Cell>{parameter}</Cell>
            <Cell>{code}</Cell>
            <Cell>{description}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};

export default ParsedUWPTable;
