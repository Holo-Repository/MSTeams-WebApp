/**
 * Interface for a visual container that is an abstraction of the Fluid Container.
 * It is used to register which containers belong to which location.
 */
export default interface ContainerMap {
    id: string;
    name: string;
    description: string;
    locationId: string;
}