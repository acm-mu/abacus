import React from 'react'
import Moment from 'react-moment'
import './IAmATeapot.scss'

export const IAmATeapot = (): React.JSX.Element => {
  const wrappedHTML = [
    ``,
    `                                                                                                                    ,;i1111iiiiiii;;:,.                                                                                                                   `,
    `                                                                                                                   1080CLfffLLCCCCGG0000,                                                                                                                 `,
    `                                                                                                                   ;008888@@@@@@@8888800.                                                                                                                 `,
    `                                                                                                                  . LG00000888888888888L                                                                                                                  `,
    `                                                                                                                    iG00888888888808888,                                                                                                                  `,
    `                                                                                                                    .L0888888888888888L                                                                                                                   `,
    `                                                                                                                    .C8888888888888808;                                                                                                                   `,
    `                                                                                                                  .iLG@GLLLLLLCCGG8008G,                                                                                                                  `,
    `                                                                                                               .ifLCG088000888888888880GLt,                                                                                                               `,
    `                                                                                                            .iffCG08888GffLG00800GLLG@8800CL1.                                                                                                            `,
    `                                                                                                         ,itfLCG088888LfffLLLLLLLLLLLC88880GGCLi, .                                                                                                       `,
    `                                                                                                  ....,itfLCCG0088888CtfffLLLLLLCCLCLCC8888800GCLfi.                                                                                                      `,
    `                                                                                     ...,,,,::::::::itfLLLCG00888888CtffLLLLLLLLLLCLCCLC08888800GGCLti::::,,,...                                                                                          `,
    `                .,,,,,,...                                                      ..,,::::;;;;;;;;;itffLLCG0088888888GffffLLLLLLLLLCCCCLLCLG@8888800GGCLft;:::::::::,,,,,.                                                                                  `,
    `              .,,,,,,,,,,:,,.                                                 .,,,::;;iii;;;;;itffLLCCGG0888888888LffffLLLLLLLLLLCCCCLLCLCC8888888000GGCLf1;;;;;;::::::,,,,.                                                                              `,
    `            ,:,,,,,,,,,,,,::::,                                               .::,,,:;;iii11tffLLCCCGG0088888888LfffffLLLLLLLLLLLCCCCCCCCCCL0@888888000GGCCLf1i;;;;;;::::,,,:                                                                             `,
    `          .:::::::::,,,,,,,,::::,.                                             ,;;;;::::,,,::;1fLCG08888880088CfffffLLLLLLLLLCLLLCCCCCCCCCCCLL0@@@@@@8800GGCCLft1;;:::,:::;i:                            ..,,,,,,,,,:::::::::,..                          `,
    `        .:;;;;;;;;;;::::::::::::;:,                                             :;;iiii;;;;;;;::::,,,,....,,,,::;;ii11ttffffffLLLLLLLLLCLLLLLftLCCLLt1ii;:,,,,::::::;;;iii1;                         .,:,,,:,,,,,,,,,,,,,,,::::::;:.                      `,
    `       .;;;iiiiiiii;;;;:::::::::::::,                                            :;;iiiiiiiiiiiiiii;;;;;;;;;;;;;;;;;::::::::::::::::::::::::::;:;;;;;;;;iiiiiiii11111111iii.                      .,,,,::,,,,::;;;;iiiiii;;;;:::::::;:,                   `,
    `      .i;iiiiiiiiiiiii;;;;::::::::::::,                                          .:;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii11iiiiiii1111111111111111iii.                    .,,,::,,:::;iiii1111111111111iiiii;;::::;:                 `,
    `      ,;;;;;;;iiiiiiiii;;;;;::::::::::::,                                        ,:;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1111111111111111111111111111111111111111111ii;.                   .::::,,::iii11t1111i;;:::;;i1111t111iiii;;;:;:               `,
    `               .;iiiiiiii;;;;:::::::::::::.                                   .:::;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1111111111111111111111111111;.                .:::::::;ii11tti;,               .:i111111iii;;;i,             `,
    `                 .:iiiiiii;;;;;:::::::::::::,                              .,::::::,::;;;iiiiiiiiiiiiiiiii11i11111111111111111111111111111111111111111111111111111111111i;;;:.           .,:::::;iii11t1:.                      .;11t1iiii;;;;            `,
    `                   ,iiiiiii;;;;:::::::::::::::,.                         .,:::::::,,,,::::::::;::::;;;;;;iiiiiiiiiiiiiii1111111111111111111111111111111111iiiiiiiiiii;;;;;;;:;;,.       ,:;:::;;ii111i,                           .:1111iii;;ii.          `,
    `                    .iiiiiii;;;;::::::::::::::::,.                     ,,,,,,:::,,,:::::::::::::::::::::::::::::::::::::::::::::::::;;;;::;:;;::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:    .:;:::;;ii1111;                               .i111iiiiiii          `,
    `                     .i;iiiii;;;;;:::::::::::::::,:,.                ,::::,,,,:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;;;;;;;;;;;;;;;;;;::::::;;;ii11111:                                  :111iiiiii;         `,
    `                      .iiiiiii;;;;;::::::::::::::::::,.            .,::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;;;;;;;;::::;;iii1111:                                    ;111iiiii1,        `,
    `                      .,iiiiiiii;;;:::::::::::::::::::::,.       .:,::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;;;;:::::;iii1111t.                                    .i1iiiiiii;        `,
    `                        ,iiiiiiii;;;;::::::,::::::::::::,,:,,....:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;:;;;iiii11111                                      ;iiiiiiii1        `,
    `                         :iiiiiiii;;;;::::::::::,::::::::::,,,,:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;;;;;iiiiii111                                      :iiiiiiii1.       `,
    `                         .;iiiiiii;;;;::::::,,::::::,,,::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;;;;;;;iiiiiii111                                      :iiiiiiii1,       `,
    `                          ,;iiiiiii;;;;::::::,:::::,,,,,,,,::::::::::::::::::::::::::::::::::::::::::::::::::;G001:::::::::::::::::::::::;8008;;:::::::::::::::::::::::::::::;;;;;;;;;;;;iiiiii111,                                     :iiiiiii11,       `,
    `                           ,;iiiiiiii;;;:::::::,:,::,,,,,,,:::::::::::::::::::::::::::::::::::::::::::::::::10000GL,:::::::::::::::::::::088888i:::::::::::::::::::::::::::::;;;;;;;;;;;iiiii1ii1t:                                    .iiiii;ii1t.       `,
    `                            ;iiiiiiiii;;;;::::::,::::,,,,,,:::::::::::::::::::::::::::::::::::::::::::::::::0G00000;::::::::::::::::::::i8888800,::::::::::::::::::::::::::;;;;;;;;;;;;;;iiii11i11.                                    :;ii;;;i111        `,
    `                            .;iiiiiiiiiii;;::::::::::,,,,,,::::::::::::;::::::::::::::::::::::::::::::::::::00000001::::::::::::::::::::;8888888i:::::::::::::::::::::::::;;;;;;;;;;;;;;;iiii111i.                                    .;i;;;;ii1t:        `,
    `                             ,iiiiiiiiiii;;;;:::::::,,,,,:::::::::;;;::::;::::::::::::::::::::::::::::::::::0000000i:::::::::::::::::::::G888888;:::::::::::::::::::::;;;;;;;;;;;;;;iiii;iii11i1;                                    .;;;;;;iii1i         `,
    `                              ;iiiiiiiiiii;;;;;;::::::::::;;;::;;;;;;;;;;;::::::::::::::::::::::::::::::::::C00000C,::::::::::::::::::::::888800,:::::::::::::::;:;;;;;;;;;;;;;;;;;iiiiiiiiii11ii                                   .;i;;;;;iii1.         `,
    `                               ;iiiiiiiiiiii;;;;;;:::::::;;;;:;;;;;;;;;;;;:::::::::::::::::::::::::::::::::::G000C:::::::::::::::::::::::::C88C:::::::::::::::::;;;;;;;;;;;;;;;;;;;;iiiiiiiiii1ii,                                 .;;;;;;;iii1.          `,
    `                               ,iiiiiiiiiiiii;;;;;;;::::;;;;;;;;;;;;;;;;;;;;;:;;::::::::::::::::::::::::::::::::::::::::::::::::::::::::::,::::::::::::::::::;;;;;;;;;;;;;;;;;;;;;iiiiiiiiiiii11i:                                :;;;;;;;ii1i.           `,
    `                                :iiiiiiiiiiiiiii;;;;;;;:;i;;;;;;;;;;;;;;;;;;;;;;;;;::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;;;;;;;;;;;;;iiiiiiiiiiiiiiiiii111;                              .;;;;;;;;ii1i.            `,
    `                                .;iiiiiiiiiiiiii;ii;;;;;ii;i;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;;;;;;;;;;;;;;;;;;;;;;;;i;iiiiiiiiiiiiiiiiit1i.                            :;;;;;;;;ii1;              `,
    `                                 .;iiiiiiiiiiiiiiii;;;;;iiiiiiiii;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:;::;;:::::;:;;:::::;:;::;::;:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;iiiiiiiiiiiiiiiiiiiiiiiiiiii1t1i,                          ,;;;;;;;;iii1,               `,
    `                                  ,iiiiiiiiiiiiiiiii;iiiiiiiiiiiiiii;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1ttti:                        ,;;;;;;:;;ii1i.                `,
    `                                   ,iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii11tti:                      .;;;;;;;;;iiii,                  `,
    `                                    :;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii;i;;;;;;i;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;i;i;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1iiiiiiiiiiiiiiiiiiiiiiii11111i:                    .;;;;;;;;;;ii1:                    `,
    `                                     :iiiiiiiiiiiiiiiiiiiii;;i;iiiiiiiiiiiiiiiiiiiii;tGGtiii;;;;;;;i;;;iii;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1801iiiiiiiiiiiiiiii111111111ii,                  .;;;;;;;;;;ii1i.                     `,
    `                                      :iiiiiiiiiiiiiiiiiiii;;;i;;iiiiiiiiiiiiiiiiii;C8@@CiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiG88tiiiiiiiiiiiii11111111111ii,                ,i;;;;;;;;;ii1;.                       `,
    `                                      .:iiiiiiiiiiiiiiiiiii;;;;;;;;iiiiiiiiiiiiiiiiL@@8@1iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1iiiiiiiiiiiiL888t1i111111111111111111111i;.              ,;ii;;;;;;;ii1;.                         `,
    `                                        :;iiiiiiiiiiiiiiiii;;;;;;;;iiiiiiiiiiiiiii188@8@iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1iiiiiiiiiii1t888011111111111111111111111i;.           .:i;ii;;;;;;ii1i.                           `,
    `                                         :;iiiiiiiiiiiiiiii;;;;;;ii;;;;iiiiiiiiiiif88888Liiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii11111111111111i1i1i1111L8888G11111111111111111111111:          ,;iiiii;;;;ii11;.                             `,
    `                                          ,;iiiiiiiiiiiiiii;;;i;ii;;iiiiiiiiiiiiiiiGf;f801iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1111111111111111111111111111111111108888@L1111111111111111ii1111,       .;iiiiiiii;;ii11:                                `,
    `                                           .;iiiiiiiiiiiiii;;;iiiii;iiiiiiiiiiiiiiiiiiii081iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1111111111111111111111111111111111L880LG0G1111111111111111ii1111.    .;iiiiiiiii;iii1i: .                                `,
    `                                             ,;iiiiiiiiiiii;ii;iiiiiiiiiiiiiiiiiiiiiiiiii08tiiiiiiiiiiiiiiiii11iiiiii111111111111111111111111111111111111111111111L08L111i111111111111111iiii1111,.:11111iiiiiiiiii1i.                                    `,
    `                                               :iiiiiiiiiii;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiL0Ciiiiiiiiiiiiiii11111111111111111111111111111111111111111111111111111L80t111111111111111111111iii111tt11111111iiiiiii1:.                                      `,
    `                                                .:;iiiiiiii;i;iiiiiiiiiiiiiiiiiiiiiiiiiiiii1001iiiiiiiiiiiiiiiiiiiiii11i1111111111111111111111111111111111111111G0C11111111111111111111111iii111t111111111iii11i,                                         `,
    `                                                   ,;iiiii;;;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiG0Ci1iiiiiiiiiiiiiiiiiiiiiiiii11111111111111111111111111111111111L001111111111111111111111111iii11tt111111111111:  .                                         `,
    `                                                      ,;ii;:;i;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit00Liiiiiiiiiiiiiiiiiiiiii111111111111111111111111111111111111tG0f111111111111111111111111iiii1ttttttttt1111i,                                              `,
    `                                                          .,;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiC00fi1iiiiiiiiiiiiiiiiii1111111111111111111111111111111111tG0L111111111111111111111111111iii1tttttt11111:                                                 `,
    `                                                            ,;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1iiG00L11iiiiiii11111111111111111111111111111111111111111tG0L11111111111111111111111111111iiittttt1111i.                                                   `,
    `                                                             .;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1iG00Gt111i11111111111111111111111111111111111111111L00f11111111111111111111111111111111itttt111i.                                                      `,
    `                                                              .;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1ii1L0G0C1111111111111111111111111111111111111111tG0Gt111111111111111111111111111111111i1tt11i,                                                         `,
    `                                                               .;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1i11itG000Gf111111111111111111111111111111111fG0Gf1111111111111111111111111111111111111t1;.                                                            `,
    `                                                                 :iiiiiiiiiiiiiiiiiiiiiiiiiiiii1111111111111G0000GL11111i1111111111111111111L008Gt111111111111111111111111111111111111i1.                                                                 `,
    `                                                                  ,iiiiiiiiiiiiiiiiiiiiiiiiiiii11111111111111i1L0000080GLft11111111ttfCG0000GL1111111111111111111111111111111111111111;                                                                   `,
    `                                                                    :iiiiiiiiiiiiiiiiiiiiiiiiii111111111111111111111fCG0000000000000000CLt1111111111111111111111111111111111111111111.                                                                    `,
    `                                                                      iiiiiiiiiiiiiiiiiii1iiiii111111111111111111111111111111111111111111111111111111111111111111111111111111111111: ...                                                                  `,
    `                                                                  ......iiiiiiiiiiiiiiiiiiiiiii1111111111111111111111111111111111111111111111111111111111111111111111111111111111;..........                                                              `,
    `                                                             .........,,,,i1iiiiiiiiiiiii111iii111111111111111111111111111111111111111111111111111111111111111111111111111111t1:.,,,..............                                                        `,
    `                                                           .......,,,,,,::::;111iiiiiiiiiiiiiii1111111111111111111111111111111111111111111111111111111111111111111111111111t1:,::,,,,,,,,,..............                                                  `,
    `                                                           .......,,,,,:::::;;;i111111111111iii11111111111111111111111111111111111111111111111111111111111111111111111tttti;;;;:::::::,,,,,,,,,............                                               `,
    `                                                            .......,,,,,:::;;;iii1ttt11111111111111111111111111111111111111111111111111111111111111111111111111tttttttt1iii;i;;;;;:::::::,,,,,,,,..........                                               `,
    `                                                              ......,,,,:::;;;ii111ttffft11111111111111111111111111111111111111111111111111111111111111tt1tttttttffft11111iiii;;;;;:::::,,,,,,,,,..........                                               `,
    `                                                                 ......,,,:::;;iii11ttfLCGCLffttt111111111111111111111111111111111111111111111ttttttttttttfffLLffftttt11111iii;;;;;:::::,,,,,,,............                                               `,
    `                                                                   ......,,,:::;;ii11ttfLLGGGGCCCLLffftttttttt1t11111tttttt1tttttttt1ttttttttttttfffffLLLCCGCCLfffffttt1111iii;;;;:::::,,,,,,,..........                                                  `,
    `                                                                       ....,,,:::;;;ii1ttffLCGGGGGGGCGCCCCCCLLLLLfffffffffffffffffffffffLLLLLLCCCCCGGGGGGGCLLLLfffttt1111iii;;;;::::,,,,,,,..........                                                     `,
    `                                                                         .....,,,,:::;;ii11ttffLLCGG0GGGGGGGGGGGGGCCCCCCCCCCCCCCCCCCGGGGGGGGGGGGGGGGGGGCLLLLLffftt1111iii;;;;::::,,,,,,.........                                                          `,
    `                                                                              .....,,,:::;;;ii111ttfffLCCCG000000000GGGGGGGGGGGGG000000G0000000GGCCCLLLLfffttt1111iii;;;;::::::,,,,,........                                                              `,
    `                                                                                  .....,,,,,::::;;;iii1111ttffffLLLLLCCCCCGGGGGGGGGGCCCCCCCLLLLLfftttt1111iiii;;;;::::::,,,,,,.........  .                                                                `,
    `                                                                                       .......,,,,,::::::::;;;;;iiiiiiiiii1i111111111111iiiiiiiii;;;;;;;:::::::::,,,,,,,..........                                                                        `,
    `                                                                                            ..............,,,,,,,,,:::::::::::::::::::::::::::,,,,,,,,,,,,.,,............                                                                                 `,
    `                                                                                                           ......................,,,.........................                                                                                             `,
    `                                                                                                                                 ...                                                                                                                      `,
    `                                                                                                                                                                                                                                                          `,
    `                                                                                                                                                                                                                                                          `,
    `                                                                                                                                                                                                                                                          `,
    `                                                                                                                                                                                                                                                          `,
    `                                                                                                                                                                                                                                                          `,
    `                                                                                                                                                                                                                                                          `,
    ``
  ].join('\n')
  return (
    <div id="teapot">
      <div>
        <b>REQUEST</b>
        <p>BREW /coffee HTTP/1.1</p>
        <p>Host: {window.location.hostname}</p>
        <p>User-Agent: {navigator.userAgent}</p>
        <p>Accept-Language: en-US,en;q=0.5</p>
        <p>Accept-Encoding: gzip, deflate</p>
        <br />
        <b>RESPONSE</b>
        <p>HTTP/1.1 418 I&apos;m a teapot</p>
        <p>Content-Type: text/html; charset=UTF-8</p>
        <p>
          Date: <Moment />
        </p>
        <p>Connection: keep-alive</p>
        <p>Keep-Alive: timeout=5</p>
      </div>
      <pre>
        <code>{wrappedHTML}</code>
      </pre>
    </div>
  )
}
