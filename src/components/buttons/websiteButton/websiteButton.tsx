import * as React from "react";
import { BiLinkExternal } from "react-icons/bi"; // Ensure this import matches the actual package you're using
import style from './style.module.css'

interface IWebsiteButtonProps {
  session?: any; // Adjust the type based on the actual `session` object
  websiteString?: string;
  user: any;
}

const WebsiteButton: React.FunctionComponent<IWebsiteButtonProps> = ({ session, websiteString, user }) => {
  // Determine the website URL (priority: `websiteString` > `user.Website`)
  const websiteURL = websiteString || user?.Website;

  // If no website URL is available, return null
  if (!websiteURL) return null;

  return (
    <div
      id={style.websiteDiv}
      style={{ cursor: "pointer" }} // Indicates that the div is clickable
    >
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        {/* Icon Link */}
        <div id={style.websiteIconHolder}>
          <a href={websiteURL} style={{ position: "relative", zIndex: 5, cursor:"pointer" }} target="_blank" rel="noopener noreferrer">
            <BiLinkExternal color="grey" />
          </a>
        </div>

        {/* Website Text Link */}
        <h6>
          <a
            style={{ color: "aliceblue", fontSize: "1.1rem", textDecoration: "none", paddingRight: "10px" }}
            href={websiteURL}
            id={user.websiteTextLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Website:
          </a>
        </h6>
      </div>

      {/* Website URL */}
      <a
        href={websiteURL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p
          style={{
            fontSize: ".6rem",
            textDecoration: "none",
            position: "relative",
            zIndex: 3,
            width: "100%",
          }}
        >
          {websiteURL}
        </p>
      </a>

      {/* Optional Loader */}
      <div id={style.websiteLoader}></div>
    </div>
  );
};

export default WebsiteButton;
