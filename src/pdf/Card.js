import React from "react";
import { Card, Button } from "react-bootstrap";

import thumbnailDefault from "../../assets/286x180.png";

export const thumbnailPath = url => thumbnailDefault;

export const Tag = ({ tag }) => (
  <Button
    size="xs"
    variant="light"
    style={{
      padding: "5px",
      paddingTop: "2px",
      borderRadius: 0,
      marginRight: "5px",
      fontSize: "0.73em"
    }}
  >
    {tag}
  </Button>
);

export default ({ url, name, tags }) => (
  <Card style={{ maxWidth: "18rem", margin: "10px auto" }}>
    {/* <Card.Img bg="dark" variant="top" src={thumbnailPath(url)} /> */}
    <Card.Body>
      <Card.Title>{name}</Card.Title>
      <Card.Text>
        {tags.map((tag, i) => (
          <Tag key={i} tag={tag} />
        ))}
      </Card.Text>
      <a href={url} style={{ color: "skyblue" }}>
        <i className="fas fa-paperclip"></i>
      </a>
    </Card.Body>
  </Card>
);
