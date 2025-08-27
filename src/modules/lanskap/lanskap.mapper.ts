import { LanskapLinguistik } from '@app/generated/prisma';
import { formatFileSize } from '@app/lib/format-file-size';
import { imageUrl } from '@app/lib/image-url';

export const lanskapListDTOMapper = (lanskap: LanskapLinguistik[]) => {
  return lanskap.map((e) => lanskapDTOMapper(e));
};

export const lanskapDTOMapper = (lanskap: LanskapLinguistik) => {
  return {
    id: lanskap.id,
    name: lanskap.name,
    description: lanskap.description,
    filePath: imageUrl(lanskap.filePath),
    file: lanskap.file,
    fileSize: formatFileSize(lanskap.fileSize),
  };
};
