// const schema =

export type ContactUsSchema = {
  ok?: boolean;
  data?: unknown;
  errors?: unknown; // should be z.error[]
};

export const submit = async (
  _prev: ContactUsSchema | null,
  data: FormData
): Promise<ContactUsSchema> => {
  console.log(data.entries());

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        data: "successful submission",
      });
    }, 3000);
  });
};
