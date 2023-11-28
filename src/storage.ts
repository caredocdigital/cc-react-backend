import fs from 'fs';

class Storage {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    storeData(data: any): void {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(this.filePath, jsonData, 'utf-8');
    }

    fetchData(): any {
        if (fs.existsSync(this.filePath)) {
            const jsonData = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(jsonData);
        } else {
            console.log(`File does not exist: ${this.filePath}`);
            return null;
        }
    }
}

const storage = new Storage('data.json');

export default storage;
