import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

export const tags = {
  b: 'bold',
  i: 'italic'
};

interface IFormattedTextProps {
  children?: string;
  style: StyleProp<TextStyle> ;
  styles?: {
    bold?: any;
    italic?: any;
  };
}

const FormattedText = (props: IFormattedTextProps) => {
  const styles = { ...defaultStyles, ...props.styles };
  const parsed = parse(props.children);

  return (
    <Text style={props.style}>
      {parsed.map((strFragment, i) => {
        const styleName = tags[strFragment.tag];
        return <Text key={i} style={[props.style, styles[styleName]]}>{strFragment.text}</Text>;
      })}
    </Text>
  );
};

const defaultStyles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic'
  }
});

interface IStrFragment {
  tag: string;
  text: string
}

const parse = (str): IStrFragment[] => {
  const strFragments: IStrFragment[] = [];
  let tagEnd = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char == '<') {
      if (Object.keys(tags).includes(str[i+1]) && str[i+2] == '>') {
        const tag = str[i+1];
        strFragments.push({ tag: null, text: str.substr(tagEnd, i - tagEnd) });
        tagEnd = str.indexOf(`</${tag}>`, i) + 4;
        if (tagEnd) {
          strFragments.push({ tag: tag, text: str.substr(i+3, tagEnd - i - 7) });
        }
      }
    }
    if (i === str.length - 1 && i > tagEnd) {
      strFragments.push({ tag: null, text: str.substr(tagEnd, str.length - tagEnd) });
    }
  }

  return strFragments;
};

export default FormattedText;