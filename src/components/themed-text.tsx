import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  className?: string;
};

const typeClasses: Record<NonNullable<ThemedTextProps["type"]>, string> = {
  default: "text-base leading-6",
  defaultSemiBold: "text-base leading-6 font-semibold",
  title: "text-[32px] font-bold leading-8",
  subtitle: "text-xl font-bold",
  link: "text-base leading-[30px] text-primary dark:text-primary",
};

export function ThemedText({
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={[
        "text-[#11181C] dark:text-[#ECEDEE]",
        typeClasses[type],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
