import { TextField, Label, FieldError, Button, Input } from 'react-aria-components';
import { useState } from 'react';
import s from './App.module.css';
import './uwp-parser/uwp-parser.ts';
import { parseUWPString, validateUWPString } from './uwp-parser/uwp-parser.ts';
import ParsedUWPTable from './components/ParsedUWPTable/ParsedUWPTable.tsx';
import type { UWPDetails } from './uwp-parser/types.ts';

function App() {
  const [uwpString, setUwpString] = useState('');
  const [uwpError, setUwpError] = useState<string | false>(false);

  const [parsedUWP, setParsedUWP] = useState<UWPDetails | null>(null);

  const validateUWP = (uwp: string) => {
    const isError = validateUWPString(uwp);
    setUwpError(isError);
  };

  const parseUWP = () => {
    if (!uwpString || uwpError) return;

    const result = parseUWPString(uwpString);
    setParsedUWP(result);
  };

  return (
    <div className={s.appContainer}>
      <h1>Traveller RPG Assistant</h1>
      <div className={s.uwpContainer}>
        <TextField isInvalid={!!uwpError}>
          <Label>UWP</Label>
          <Input
            data-testid="uwp-input"
            value={uwpString}
            onBlur={() => validateUWP(uwpString)}
            onChange={(e) => setUwpString(e.target.value)}
          />
          <FieldError>{uwpError}</FieldError>
        </TextField>
        <Button
          data-testid="parse-uwp-button"
          isDisabled={!uwpString || !!uwpError}
          onClick={() => parseUWP()}
        >
          Parse UWP
        </Button>

        <ParsedUWPTable parsedUWP={parsedUWP} />
      </div>
    </div>
  );
}

export default App;
