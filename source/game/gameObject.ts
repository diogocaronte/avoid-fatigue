export type gobResponse = string;

export interface GameObjectConfig {
    name: gobResponse;
    layer: gobResponse;
    isStatic?: gobResponse;
    transform?: gobResponse;
    setActive?: gobResponse;
    destroy?: gobResponse;
    [sprite: gobResponse]: any;
}
   
export default GameObjectConfig;