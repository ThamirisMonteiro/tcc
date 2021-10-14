export class Noticia {
  constructor(
        public id: string,
        public address: string,
        public title: string,
        public subtitle: string,
        public category: string,
        public image: string,
        public text: string,
        public active: boolean) {}
}

