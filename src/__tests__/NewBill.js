/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";

import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then envelope icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon).not.toHaveClass("active-icon");
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon).toHaveClass("active-icon");
    });
  });
  describe("When I do not fill fields and I click on submit button 'Envoyer'", () => {
    test("Then It should renders NewBill page", () => {
      document.body.innerHTML = NewBillUI();

      const inputDate = screen.getByTestId("datepicker");
      expect(inputDate.value).toBe("");

      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount.value).toBe("");

      const inputPercent = screen.getByTestId("pct");
      expect(inputPercent.value).toBe("");

      const inputFile = screen.getByTestId("file");
      expect(inputFile.value).toBe("");

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });
  describe("When I do fill inputs in incorrect formats", () => {
    test("Then It should not fill them", () => {
      document.body.innerHTML = NewBillUI();

      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: "24/03/2023" } });
      expect(inputDate.value).toBe("");

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: "abc" } });
      expect(inputAmount.value).toBe("");

      const inputPercent = screen.getByTestId("pct");
      fireEvent.change(inputPercent, { target: { value: "def" } });
      expect(inputPercent.value).toBe("");
    });
  });
  describe("When I am on NewBill Page and I upload a .txt file", () => {
    test("Then the imput file should be empty", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);

      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      const file = new File(["dummy-content"], "myFile.txt", {
        type: "text/plain",
      });
      await userEvent.upload(inputFile, file);
      expect(handleChangeFile).not.toHaveBeenCalled();
      expect(inputFile).toHaveValue("");
    });
  });
  describe("When I do fill fields in correct format and I click on submit button 'Envoyer'", () => {
    test("Then It should create a new bill and redirect to Bills page", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);

      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: "2022-11-11" } });
      expect(inputDate.value).toBe("2022-11-11");

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: "120" } });
      expect(inputAmount.value).toBe("120");

      const inputPercent = screen.getByTestId("pct");
      fireEvent.change(inputPercent, { target: { value: "20" } });
      expect(inputPercent.value).toBe("20");

      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      const file = new File(["dummy-content"], "myImage.png", {
        type: "image/png",
      });
      await userEvent.upload(inputFile, file);
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile).toHaveValue("C:\\fakepath\\myImage.png");
      expect(inputFile.files[0]).toStrictEqual(file);
      expect(inputFile.files).toHaveLength(1);

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBillContainer.handleSubmit);

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });
  });
  describe("When I do fill fields in correct format but keep Percentage field empty and I click on submit button 'Envoyer'", () => {
    test("Then It should create a new bill and redirect to Bills page", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);

      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: "2022-11-11" } });
      expect(inputDate.value).toBe("2022-11-11");

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: "120" } });
      expect(inputAmount.value).toBe("120");

      const inputPercent = screen.getByTestId("pct");
      expect(inputPercent.value).toBe("");

      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);

      const file = new File(["dummy-content"], "myImage.png", {
        type: "image/png",
      });
      await userEvent.upload(inputFile, file);
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile).toHaveValue("C:\\fakepath\\myImage.png");
      expect(inputFile.files[0]).toStrictEqual(file);
      expect(inputFile.files).toHaveLength(1);

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBillContainer.handleSubmit);

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });
  });
});

describe("When I am on NewBill Page and I upload an file in the right format", () => {
  test("Then the input file must contain the uploaded png file", async () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    document.body.innerHTML = NewBillUI();
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });

    const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);

    const inputFile = screen.getByTestId("file");
    expect(inputFile.files).toHaveLength(0);

    inputFile.addEventListener("change", handleChangeFile);
    const file = new File(["dummy-content"], "myFile.png", {
      type: "image/png",
    });
    await userEvent.upload(inputFile, file);
    expect(handleChangeFile).toHaveBeenCalled();
    expect(inputFile).toHaveValue("C:\\fakepath\\myFile.png");
    expect(inputFile.files[0]).toStrictEqual(file);
    expect(inputFile.files).toHaveLength(1);
  });
});
