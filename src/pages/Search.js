import React, { useState } from "react";
import {
  Container,
  FormControl,
  Row,
  Col,
  InputGroup,
  Dropdown,
  DropdownButton
} from "react-bootstrap";
import PDFCard from "../pdf/Card";
import config from "../../papers/config.json";
import path from "path";
import Fuse from "fuse.js";
import * as rxjs from "rxjs";

export const Header = ({ user, numPapers }) => (
  <>
    <div style={{ fontSize: "2em" }}> Papers for {user} </div>
    <div style={{ fontSize: "1.24em", opacity: 0.8 }}>
      {numPapers + " "}
      Papers Available
    </div>
  </>
);

export const SearchBar = ({ text = "", onValueChange = _ => {}, onSelectorChange = _ => {}}) => {
  let [current, setCurrent] = useState(["Tag", "Name"]);
  const setSelector = cur => {
    setCurrent(cur);
    onSelectorChange(cur[0]);
  };
  return (
    <InputGroup className="mb-3">
      <DropdownButton
        as={InputGroup.Prepend}
        variant="outline-secondary"
        title={current[0]}
      >
        {current.slice(1, current.length).map((but, i) => {
          return (
            <Dropdown.Item
              key={i}
              href="#"
              onClick={() => setSelector(current.slice().reverse())}
            >
              {but}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
      <FormControl
        onChange={e => onValueChange(e.target.value)}
        placeholder={`Search by ${current[0].toLowerCase()}`}
        value={text}
      />
    </InputGroup>
  );
};

export const SearchPage = ({ initialPapers }) => {
  let [searchState, setSearchState] = useState("");
  let [papers, setPapers] = useState(initialPapers);
  let [selector, setSelector] = useState("Tag");
  const searchMethod = {
    "Tag": new Fuse(initialPapers, {
      keys: ["tags"],
      shouldSort: false,
      location: 0
    }),
    "Name": new Fuse(initialPapers, {
      keys: ["name"],
      threshold: 0.2
    })
  };

  let subject = new rxjs.Subject();
  let observable = subject.asObservable();
  observable.subscribe(state => {
    setSearchState(state);
    if (state === "") {
      setPapers(initialPapers);
    } else {
      setPapers(searchMethod[selector].search(state));
    }
  });

  return (
    <Container>
      <Row>
        <Col md={12} lg={6}>
          <Header user={config.user} numPapers={papers.length} />
        </Col>
        <Col md={12} lg={6} style={{ alignSelf: "flex-end" }}>
          <SearchBar
            text={searchState}
            onValueChange={state => subject.next(state)}
            onSelectorChange={setSelector}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "12px" }}>
        {papers
          .map((paper, i) => (
            <Col className="pdfCol" lg={3} sm={5} xs={12} key={i}>
              <PDFCard
                url={"papers/" + paper.ref}
                name={paper.name}
                tags={paper.tags}
              />
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default SearchPage;
