import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "OpenSans",
    fontSize: 16,
  },
  title: {
    fontFamily: "OpenSans",
    fontSize: 22,
  },
  defaultSemiBold: {
    fontFamily: "OpenSans",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontFamily: "OpenSans",
    fontSize: 14,
    color: "#555",
  },
  link: {
    fontFamily: "OpenSans",
    fontSize: 16,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
