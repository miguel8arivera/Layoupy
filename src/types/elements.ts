export type ElementType = 'text' | 'radio' | 'button' | 'section' | 'stage'

export interface BaseElement {
  id: string
  type: ElementType
}

export type TextType = 'statement' | 'agentNote' | 'verbatimDisclosure' | 'regularQuestion'

export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  textType?: TextType
}

export interface RadioElement extends BaseElement {
  type: 'radio'
  name: string // Nombre único con nomenclatura: mayúscula inicial, sin espacios
  options: string[]
}

export interface ButtonElement extends BaseElement {
  type: 'button'
  label: string
}

export interface SectionElement extends BaseElement {
  type: 'section'
  title: string
  condition?: {
    dependsOn: string // Nombre del radio que controla esta sección (ej: "AreYouAdult")
    value: string // Valor que debe tener para mostrar esta sección
  }
  children: FormElement[]
}

export interface StageElement extends BaseElement {
  type: 'stage'
  name: string
  icon: string
  isActive: boolean
}

export type FormElement = TextElement | RadioElement | ButtonElement | SectionElement | StageElement
