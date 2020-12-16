import React from "react";
import ReactMarkdown from "react-markdown";
import GFM from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";

// CSS
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./App.css";
import "@primer/css/dist/markdown.css";

// Font
import "fontsource-roboto";

interface IProps {}
interface IState {
  sourceText: string;
}

class App extends React.Component<IProps, IState> {
  private renders = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ language, value }: any) => {
      return (
        <SyntaxHighlighter
          style={github}
          customStyle={{
            padding: "inherit",
          }}
          language={language || "text"}
          children={value || " "}
        />
      );
    },
  };

  public constructor(props: IProps) {
    super(props);
    this.state = {
      sourceText: "",
    };
    this.updateSourceText = this.updateSourceText.bind(this);
  }

  public updateSourceText(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({
      sourceText: (event.target as HTMLTextAreaElement).value,
    });
  }

  public render(): JSX.Element {
    return (
      <div className="App">
        <div id="source">
          <textarea
            id="source-el"
            value={this.state.sourceText}
            onChange={this.updateSourceText}
            spellCheck={false}
          ></textarea>
        </div>
        <div id="output">
          <div id="output-el" className="markdown-body">
            <ReactMarkdown
              plugins={[GFM]}
              renderers={this.renders}
              children={this.state.sourceText}
              allowDangerousHtml
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
