const aiMap: Record<
  string,
  { name: string; length?: number; variable: boolean }
> = {
  '00': { name: 'SSCC', length: 18, variable: false },
  '01': { name: 'GTIN', length: 14, variable: false },
  '02': { name: 'ContentGTIN', length: 14, variable: false },
  '10': { name: 'BatchOrLot', variable: true },
  '11': { name: 'ProductionDate', length: 6, variable: false },
  '15': { name: 'BestBeforeDate', length: 6, variable: false },
  '17': { name: 'ExpirationDate', length: 6, variable: false },
  '20': { name: 'ProductVariant', length: 2, variable: false },
  '21': { name: 'SerialNumber', variable: true },
  '22': { name: 'SecondaryData', variable: true },
  '30': { name: 'Count', variable: true },
  '37': { name: 'Quantity', variable: true },
  '91': { name: 'Internal1', variable: true },
  '92': { name: 'Internal2', variable: true },
  '93': { name: 'Internal3', variable: true },
  '94': { name: 'Internal4', variable: true },
  '95': { name: 'Internal5', variable: true },
  '96': { name: 'Internal6', variable: true },
  '97': { name: 'Internal7', variable: true },
  '98': { name: 'Authentication', variable: true },
  '99': { name: 'Internal9', variable: true },
};

export function parseGS1(data: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  let index = 0;

  while (index < data.length) {
    let ai = '';
    let aiInfo;

    for (let len = 4; len >= 2; len--) {
      const candidate = data.substr(index, len);
      if (aiMap[candidate]) {
        ai = candidate;
        aiInfo = aiMap[candidate];
        break;
      }
    }

    if (ai && aiInfo) {
      const { name, length, variable } = aiInfo;
      const valueStart = index + ai.length;

      if (variable) {
        let fnc1Index = data.indexOf('\x1D', valueStart);

        let endIndex =
          fnc1Index !== -1
            ? fnc1Index
            : findNextAICandidateIndex(data, valueStart);

        parsed[name] = data.substring(valueStart, endIndex);
        index = fnc1Index !== -1 ? endIndex + 1 : endIndex;
      } else {
        parsed[name] = data.substr(valueStart, length!);
        index = valueStart + length!;
      }
    } else {
      index += 1;
    }
  }

  return parsed;
}

export function addGS1Parentheses(data: string): string {
  const aiMap: Record<string, { variable: boolean }> = {
    '00': { variable: false },
    '01': { variable: false },
    '02': { variable: false },
    '10': { variable: true },
    '11': { variable: false },
    '15': { variable: false },
    '17': { variable: false },
    '20': { variable: false },
    '21': { variable: true },
    '22': { variable: true },
    '30': { variable: true },
    '37': { variable: true },
    '91': { variable: true },
    '92': { variable: true },
    '93': { variable: true },
    '94': { variable: true },
    '95': { variable: true },
    '96': { variable: true },
    '97': { variable: true },
    '98': { variable: true },
    '99': { variable: true },
  };

  const fixedLengths: Record<string, number> = {
    '00': 18,
    '01': 14,
    '02': 14,
    '11': 6,
    '15': 6,
    '17': 6,
    '20': 2,
  };

  let result = '';
  const segments = data.split('\x1D');

  for (const segment of segments) {
    let index = 0;
    while (index < segment.length) {
      const ai = segment.substr(index, 2);
      const aiInfo = aiMap[ai];

      if (aiInfo) {
        result += `(${ai})`;
        index += 2;

        if (aiInfo.variable) {
          const nextAI = findNextAICandidateIndex(segment, index);
          result += segment.substring(index, nextAI);
          index = nextAI;
        } else {
          const len = fixedLengths[ai];
          result += segment.substr(index, len);
          index += len;
        }
      } else {
        result += segment[index];
        index++;
      }
    }
  }

  return result;
}

function findNextAICandidateIndex(data: string, fromIndex: number): number {
  for (let i = fromIndex; i < data.length; i++) {
    for (let len = 4; len >= 2; len--) {
      const candidate = data.substring(i, i + len);
      if (aiMap[candidate]) {
        return i;
      }
    }
  }
  return data.length;
}
