export interface Route {
  path: string;
  name?: string;
  icon?: string;
  component: React.Component | React.FunctionComponent | any;
  layout: string;
  sidebar?: boolean | false;
}
