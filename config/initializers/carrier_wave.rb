if Rails.env.production?
  CarrierWave.configure do |config|
    config.fog_credentials = {
      # Configuration for Amazon S3
      :provider              => 'AWS',
      :aws_access_key_id     => ENV['S3_ACCESS_KEY'],
      :aws_secret_access_key => ENV['S3_SECRET_KEY']
    }
    config.fog_directory     =  ENV['S3_BUCKET']
  end
end

module CarrierWave
  module MiniMagick

    def optimize_header
      manipulate! do |img|
          return img unless img.mime_type.match(/image\/jpeg/) && File.size(img.path) > 150000
          img.strip
          img.resize "800x800>"
          img.combine_options do |c|
              c.quality "85"
              c.depth "8"
              c.interlace "plane"
          end
          img
      end
    end

    def optimize_background
      manipulate! do |img|
          return img unless img.mime_type.match(/image\/jpeg/) && File.size(img.path) > 350000
          img.strip
          img.resize "2000x2000>"
          img.combine_options do |c|
              c.quality "85"
              c.depth "8"
              c.interlace "plane"
          end
          img
      end
    end

  end
end