import React from "react";

type Props = {
  value: string;
};

export function TextInput({ value }: Props) {
  return <input type="text" value={value} />;
}
