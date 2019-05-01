import * as React from "react";
import * as ReactDom from "react-dom";
import { ComponentType } from "react";
import { SingletonComponentWrapper } from "../Components/SingletonComponentWrapper";

export class Singleton<IProps> {
  private scwInstance?: SingletonComponentWrapper;
  private unmountDelayHandle: number = -1;

  constructor(protected component: ComponentType<any>) {
    ReactDom.render(
      <SingletonComponentWrapper
        referenceCallback={(_instance: any) => (this.scwInstance = _instance)}
        wrappedComponent={this.component}
      />,
      document.body.appendChild(document.createElement("div"))
    );
  }

  public mount(props: IProps): void {
    if (typeof this.scwInstance !== "undefined")
      this.scwInstance.setState({
        wrappedProps: props,
        shouldBeMounted: true
      });
  }

  public update(props: IProps): void {
    if (typeof this.scwInstance !== "undefined")
      this.scwInstance.setState({
        wrappedProps: props
      });
  }

  public unmount(delay?: number): void {
    window.clearTimeout(this.unmountDelayHandle);
    if (typeof delay !== "undefined")
      this.unmountDelayHandle = window.setTimeout(() => this.unmount(), delay);
    else if (typeof this.scwInstance !== "undefined")
      this.scwInstance.setState({
        shouldBeMounted: false
      });
  }
}
