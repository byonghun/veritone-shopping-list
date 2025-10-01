import { beforeEach } from "@jest/globals";
import { __reset as resetNanoid } from "./__mocks__/nanoid";

beforeEach(() => {
  resetNanoid();
});
