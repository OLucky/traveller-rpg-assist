import React from 'react';
import {
  Cell,
  Column,
  ResizableTableContainer,
  Row,
  Table,
  TableBody,
  TableHeader,
} from 'react-aria-components';
import type { UWPDetails } from '../../uwp-parser/types';

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
    <ResizableTableContainer>
      <Table data-testid="parsed-uwp-table" aria-label="UWP Data">
        <TableHeader>
          <Column isRowHeader width="2fr">
            Parameter
          </Column>
          <Column width="1fr">Code</Column>
          <Column width="10fr">Description</Column>
        </TableHeader>
        <TableBody>
          {flatData.map(({ parameter, code, description }) => (
            <Row key={`${parameter}-${code}`}>
              <Cell>{parameter}</Cell>
              <Cell style={{ textAlign: 'center' }}>{code}</Cell>
              <Cell>
                <p className="typewriter-text">{description}</p>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </ResizableTableContainer>
  );
};

export default ParsedUWPTable;
