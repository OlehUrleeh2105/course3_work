export interface User {
  email: string
  password: string
  returnSecureToken?: boolean
}

export interface FbAuthResponse {
  idToken: string
  expiresIn: string
}

export interface Place {
  id?: string
  title: string
  address: string
  hasGenerator: boolean
  hasInternet: boolean
  placeType: PlaceType
  hasElectricityNow: boolean
  description: string
  comments: string[]
  verify: boolean
}

export enum PlaceType {
  House = 'Будинок',
  Cafe = 'Кафе',
  Coworking = 'Коворкінг',
  Office = 'Офіс',
  ResiliencePoint = 'Пункт незламності',
  Other = 'Інше'
}

export interface FbCreateResponse {
  name: string
}
