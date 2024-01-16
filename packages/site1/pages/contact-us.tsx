import React from "react";

import dynamic from "next/dynamic";
import { pushData } from "../helper/dataLayer";

const ContactUsDynamic = dynamic(
  () => import("../components/ContactUs/contactUs"),
  {
    ssr: false,
  }
);

export default class ContactUs extends React.Component {
  componentDidMount() {
    const lang = localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en-us";
    if (lang !== null) {
      pushData({
        contentType: "ContactUspage",
        siteLanguage: lang.toUpperCase(),
      });
    }
  }
  render() {
    return (
      <div className="contactus-page">
        <ContactUsDynamic />
      </div>
    );
  }
}
