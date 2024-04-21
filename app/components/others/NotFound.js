import React from "react"

function NotFound(props) {
  return (
    <>
      <div className="not-found__body" style={{ maxWidth: "760px", position: "absolute", left: "25%", top: "35%" }}>
        <h1 className="not_found" style={{ color: "rgba(0, 0, 0, .9)", fontWeight: "500", textAlign: "center", fontSize: "26px" }}>
          {props.searchPage ? "We're sorry but we have no books like that." : "Ooops, the page you're visiting does not exist. Tap the link above to navigate through the site."}
        </h1>
      </div>
    </>
  )
}

export default NotFound
