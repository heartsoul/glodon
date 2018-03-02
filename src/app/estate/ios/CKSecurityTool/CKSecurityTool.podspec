Pod::Spec.new do |s|
  s.name             = "CKSecurityTool"
  s.version          = '3.0.0'
  s.summary          = "yonyou"
  s.description      = "A CKSecuritytool used on upesn."
  s.homepage         = "http://upesn.com"
  s.license          = 'MIT'
  s.author           = { "yonyou" => "apple99@yonyou.com" }
  s.source           = { :git => "git@git.yonyou.com:mi_ma/IESNSecurityTool.git", :tag => s.version.to_s }

  s.platform     = :ios, '7.0'
  s.requires_arc = true

  s.public_header_files = 'SecurityTool/*.h'
  s.source_files = 'SecurityTool/*.{h,m}'
end
