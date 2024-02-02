import React from "react";
import { Formio } from "@formio/react";
import { useEffect } from "react";
import { pushData } from "../../helper/dataLayer";

export default function ContactUsForm() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      Formio.createForm(
        document.getElementById("formio"),
        "https://ijgnbqikgzlyglh.form.io/contactus"
      ).then((form) => {
        try {
          form.on("onChange", (submission: any) => {
            if (submission.state == "submitted") {
              if (submission.instance.errors.length > 0) {
                pushData({
                  event: "form_submit_error",
                  formData: "error found",
                });
              }
            }
          });
          form.on("submitDone", (dataSubmission: any) => {
            if (dataSubmission.state == "submitted") {
              pushData({
                event: "form_submit_success",
                formData: "success",
              });
            }
          });
        } catch (error) {
          console.error(error, "error");
          pushData({
            event: "form_submit_error",
            formData: "error found",
          });
        }
      });
    }
  }, []);

  return (
    <div className="contactUsContainer">
      <form>
        <h1>Contact US</h1>
        <div id="formio"></div>
      </form>
    </div>
  );
}
