import { ParserInfo, GenericParser, ParsedData } from '../../models';
import { APP } from '../../variables';
import * as _ from "lodash";
import * as fs from "fs-extra";
import * as os from "os";
import * as genericParser from '@node-steam/vdf';
import * as path from "path";
import { globPromise } from "../helpers/glob/promise"
import { forEach, isArray } from 'lodash';
import { E } from '@angular/core/src/render3';


export class CloudParser implements GenericParser {

  private get lang() {
    return APP.lang.cloudParser;
  }
  getParserInfo(): ParserInfo {
    return {
      title: 'Xbox Cloud Gaming',
      info: this.lang.docs__md.self.join(''),
      inputs: {
        'jsonFile': {
          label: this.lang.jsonInputTitle,
          inputType: 'path',
          validationFn: null,
          info: this.lang.docs__md.input.join('')
        },
        'labelAsCloud': {
          label: this.lang.labelAsCloudTitle,
          inputType: 'toggle',
          validationFn: null,
          info: this.lang.docs__md.input.join('')
        }
        //,
        // 'browser': {
        //   label: this.lang.browserInputTitle,
        //   inputType: 'text',
        //   validationFn: null,
        //   info: this.lang.docs__md.input.join('')
        // }
        // 'xCloudLauncherMode': {
        //   label: this.lang.launcherModeInputTitle,
        //   inputType: 'toggle',
        //   validationFn: (input: any) => { return null },
        //   info: this.lang.docs__md.input.join('')
        // }
      }
    };
  }

  execute(directories: string[], inputs: { [key: string]: any }, cache?: { [key: string]: any }) {
    return new Promise<ParsedData>((resolve,reject)=>{

      let appTitles: string[] = [];
      let appCodes: string[] = [];
      let appIDs: string[] = [];
      let jsonFile: string = "";
      let browserPath: string = "";
      let labelAsCloud: boolean = inputs.labelAsCloud;

      if(inputs.jsonFile) {
        jsonFile = inputs.jsonFile;
      }

      // if (inputs.browser) {
      //   browserPath = inputs.browser;
      // } else {
        // TODO insert Microsoft Edge location
        if(os.type()=='Windows_NT') {
          browserPath = 'MICROSOFT EDGE PATH?'
        } else if(os.type()=='Linux') {
          browserPath = 'MICROSOFT EDGE PATH?'
        } else if( os.type()=='Darwin' ) {
          browserPath = '/Applications/Microsoft Edge.app';
        }
      // }

      browserPath = '/Applications/Microsoft Edge.app';

      if(!fs.existsSync(jsonFile)) {
        reject(this.lang.errors.fileNotFound__md)
      }
      if(!fs.existsSync(browserPath)) {
        reject(this.lang.errors.browserNotFound__md)
      }
      let item = JSON.parse(fs.readFileSync(jsonFile).toString())
      if (!isArray(item.games)) {
        reject(this.lang.errors.incorrectFormat__md)
      }
      item.games.forEach((element: { DisplayName: string; AppCode: string; ID: string; }) => {
        let displayName = element.DisplayName
        if (labelAsCloud) {
          displayName += " (Xbox Cloud Gaming)"
        }
        
        appTitles.push(displayName)
        appCodes.push(element.AppCode)
        appIDs.push(element.ID)
        

        // "--kiosk \"https://www.xbox.com/play/${}\" "
      });

      

      let parsedData: ParsedData = {
        executableLocation: browserPath,
        success: [],
        failed:[]
      };
      for(let i=0; i < appTitles.length; i++){
        parsedData.success.push({
          extractedTitle: appTitles[i],
          extractedAppId: appIDs[i],
          launchOptions: `--window-size=1024,640 --force-device-scale-factor=1.25 --device-scale-factor=1.25 --kiosk "https://www.xbox.com/play/launch/${appCodes[i]}/${appIDs[i]}"`,
          filePath: parsedData.executableLocation,
          // finalTitle: appTitles[i] + " (xCloud)"
        });
      }
      resolve(parsedData);
    })
  }
}
