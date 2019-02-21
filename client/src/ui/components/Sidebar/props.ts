import { Route } from '@helpers/interfaces/route';
export interface Logo {
    outterLink: string;
    text: string;
    imgSrc?: string;
}
export interface Props {
    routes: Route[]
    bgColor: string;
    logo?: Logo;
    toggleSidebar: boolean;
}