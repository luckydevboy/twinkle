import ky from "ky";

const original = ky.create({
  prefixUrl: "http://localhost:2000",
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export default original;
